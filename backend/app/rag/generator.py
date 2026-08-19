import os
import re
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.models.schemas import SourceCitation

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_TEMPLATE = """You are DocuMind AI, a state-of-the-art enterprise Retrieval-Augmented Generation (RAG) Document Assistant.

Your objective is to provide precise, accurate, and completely grounded answers to user questions based EXCLUSIVELY on the retrieved document context provided below.

Strict Operational Guidelines:
1. Grounded Truth: Base your entire answer ONLY on the explicit facts provided in the "Retrieved Context" section. Never speculate, fabricate, or incorporate external ungrounded assumptions.
2. Handling Missing Information: If the provided context snippets do NOT contain sufficient information to answer the question, clearly state:
   "Based on the uploaded documents, I could not find relevant information to answer your question."
   Do NOT attempt to make up an answer.
3. Source Citations: Reference the source documents and page numbers in your answer when referencing specific facts (e.g. `[DocumentName.pdf, Page X]`).
4. Presentation: Use clear, structured Markdown with bullet points, bold key terms, tables, or code snippets when helpful.
5. Tone: Maintain a professional, technical, and helpful demeanor.

---------------------
Retrieved Context:
{context}
---------------------
"""

class LLMGenerator:
    """
    Generates grounded answers from retrieved context snippets using OpenAI / compatible API,
    with an intelligent fallback synthesis engine for zero-key portfolio demonstration.
    """

    def __init__(self):
        self._openai_client = None

    def _get_client(self):
        if settings.OPENAI_API_KEY and self._openai_client is None:
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(
                    api_key=settings.OPENAI_API_KEY,
                    base_url=settings.OPENAI_BASE_URL
                )
            except Exception as e:
                logger.error(f"Error initializing OpenAI client for generation: {e}")
                self._openai_client = None
        return self._openai_client

    def _synthesize_local_answer(self, question: str, citations: List[SourceCitation]) -> str:
        """
        Local grounded extractive answer synthesis engine when no external API key is active.
        Performs sentence-level relevancy matching against retrieved chunks and synthesizes a structured Markdown response.
        """
        if not citations:
            return (
                "**No Relevant Information Found**\n\n"
                "I searched the indexed documents, but could not find any content with sufficient semantic similarity "
                f"to answer: *\"{question}\"*.\n\n"
                "> **Tip**: Try refining your search terms or upload additional documents."
            )

        query_terms = set(re.findall(r'\w+', question.lower()))
        # Remove common stop words
        stop_words = {"what", "is", "the", "are", "how", "why", "where", "who", "which", "in", "on", "a", "an", "and", "or", "to", "for", "of", "with", "about", "can", "you", "tell", "me", "does"}
        filtered_terms = [t for t in query_terms if t not in stop_words and len(t) > 2]

        extracted_insights = []
        for cit in citations:
            text = cit.full_text or cit.text_snippet
            sentences = re.split(r'(?<=[.!?])\s+', text)
            
            # Score sentences
            scored_sentences = []
            for s in sentences:
                s_clean = s.strip()
                if len(s_clean) < 20:
                    continue
                s_lower = s_clean.lower()
                matches = sum(1 for term in filtered_terms if term in s_lower)
                scored_sentences.append((matches, s_clean))
                
            scored_sentences.sort(key=lambda x: x[0], reverse=True)
            top_sentences = [s for score, s in scored_sentences if score > 0][:2]
            
            if top_sentences:
                extracted_insights.append({
                    "filename": cit.filename,
                    "page": cit.page_number,
                    "score": cit.similarity_score,
                    "text": " ".join(top_sentences)
                })
            else:
                # Use beginning of chunk if no keyword match
                first_sent = sentences[0].strip() if sentences else text[:150]
                extracted_insights.append({
                    "filename": cit.filename,
                    "page": cit.page_number,
                    "score": cit.similarity_score,
                    "text": first_sent
                })

        # Build clean grounded response
        response_lines = [
            f"Based on the retrieved context from **{citations[0].filename}** and associated documents, here is the synthesis:\n"
        ]

        for i, item in enumerate(extracted_insights[:3]):
            response_lines.append(
                f"- **{item['text']}** `[Source: {item['filename']} — Page {item['page']}]`"
            )

        response_lines.append(
            "\n### Key Findings & Context Summary"
        )
        # Summarize primary chunk context
        primary_text = citations[0].full_text or citations[0].text_snippet
        clean_summary = primary_text.replace('\n', ' ')
        if len(clean_summary) > 300:
            clean_summary = clean_summary[:300] + "..."
        response_lines.append(f"> {clean_summary}\n")

        response_lines.append(
            f"*Retrieved across {len(citations)} chunks with peak similarity score of {citations[0].similarity_score}%.*"
        )

        return "\n".join(response_lines)

    def generate_answer(
        self,
        question: str,
        context: str,
        citations: List[SourceCitation],
        chat_history: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """
        Generates grounded answer using configured LLM or local grounded engine.
        """
        client = self._get_client()

        # If API key configured, use live LLM
        if client and settings.OPENAI_API_KEY:
            try:
                system_message = SYSTEM_PROMPT_TEMPLATE.format(context=context if context else "[No documents retrieved]")
                
                messages = [{"role": "system", "content": system_message}]
                
                # Append last 3 turns of history if available
                if chat_history:
                    for msg in chat_history[-3:]:
                        messages.append({
                            "role": msg.get("role", "user"),
                            "content": msg.get("content", "")
                        })

                # Append current question
                messages.append({"role": "user", "content": question})

                response = client.chat.completions.create(
                    model=settings.MODEL_NAME,
                    messages=messages,
                    temperature=0.1,
                    max_tokens=1024
                )
                
                answer = response.choices[0].message.content
                return answer.strip()
            except Exception as e:
                logger.error(f"LLM generation failed: {e}. Falling back to local grounded synthesis.")

        # Standalone local grounded engine
        return self._synthesize_local_answer(question, citations)

generator = LLMGenerator()
