
import os
import glob
import re
from dataclasses import dataclass
from typing import List

from rank_bm25 import BM25Okapi

@dataclass
class DocChunk:
  doc_id: str
  chunk_id: int
  text: str
  source: str

class RAGIndex:
  def __init__(self):
    self.chunks: List[DocChunk] = []
    self._bm25 = None

  def _split(self, text: str, doc_id: str, source: str, chunk_size=512, overlap=64) -> List[DocChunk]:
    tokens = re.findall(r"\S+", text)
    chunks = []
    i = 0
    cid = 0
    while i < len(tokens):
      window = tokens[i:i+chunk_size]
      chunk_text = " ".join(window)
      chunks.append(DocChunk(doc_id=doc_id, chunk_id=cid, text=chunk_text, source=source))
      cid += 1
      i += (chunk_size - overlap)
    return chunks

  def build_from_folder(self, folder: str):
    filepaths = []
    for ext in ("*.txt", "*.md"):
      filepaths.extend(glob.glob(os.path.join(folder, ext)))
    self.chunks = []
    for path in sorted(filepaths):
      try:
        with open(path, "r", encoding="utf-8") as f:
          text = f.read()
        doc_id = os.path.splitext(os.path.basename(path))[0]
        self.chunks.extend(self._split(text, doc_id, source=os.path.basename(path)))
      except Exception as e:
        print(f"[RAG] skip {path}: {e}")
    tokenized = [c.text.split() for c in self.chunks]
    if tokenized:
      self._bm25 = BM25Okapi(tokenized)
    else:
      self._bm25 = None

  def search(self, query: str, top_k=4) -> List[DocChunk]:
    if not self._bm25 or not self.chunks:
      return []
    scores = self._bm25.get_scores(query.split())
    idxs = list(range(len(scores)))
    idxs.sort(key=lambda i: scores[i], reverse=True)
    return [self.chunks[i] for i in idxs[:top_k]]
