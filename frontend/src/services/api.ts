import { Highlight } from './highlightService';

const API_URL = 'http://localhost:3001/api';

const transformMongoDocument = (doc: any): Highlight => {
  return {
    id: doc._id.toString(),
    text: doc.text,
    note: doc.note,
    color: doc.color || '#ffeb3b',
    createdAt: doc.createdAt,
    position: doc.position
  };
};

export const saveHighlight = async (highlight: Highlight): Promise<Highlight> => {
  const response = await fetch(`${API_URL}/highlight/createHighlight`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: highlight.text,
      note: highlight.note,
      color: highlight.color,
      position: highlight.position
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save highlight');
  }

  const result = await response.json();
  return transformMongoDocument(result.data);
};

export const getAllHighlights = async (): Promise<Highlight[]> => {
  const response = await fetch(`${API_URL}/highlight`);

  if (!response.ok) {
    throw new Error('Failed to fetch highlights');
  }

  const result = await response.json();
  return result.data.map(transformMongoDocument);
};

export const updateHighlight = async (id: string, data: Partial<Highlight>): Promise<Highlight> => {
  console.log(`Updating highlight ${id} with data:`, data);
  
  const response = await fetch(`${API_URL}/highlight/updateHighlight/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update highlight');
  }

  const result = await response.json();
  return transformMongoDocument(result.data);
};

export const deleteHighlight = async (id: string): Promise<{ message: string }> => {
  console.log(`Deleting highlight with ID: ${id}`);
  
  const response = await fetch(`${API_URL}/highlight/deleteHighlight/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete highlight');
  }

  return response.json();
};
