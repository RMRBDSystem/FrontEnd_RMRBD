// api/involvementAPI.js
const UniqueId = "xnmpAnFrOpolSfwXjAVG";

export const getLikes = async () => {
  try {
    const response = await fetch(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${UniqueId}/likes/`
    );
    return await response.json();
  } catch {
    return null;
  }
};

export const addComment = async (comment) => {
  const response = await fetch(
    `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${UniqueId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const fetchComments = async (mealId) => {
  try {
    const response = await fetch(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${UniqueId}/comments?item_id=${mealId}`
    );
    return await response.json();
  } catch {
    return null;
  }
};

export const postLikes = async (id) => {
  try {
    await fetch(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/${UniqueId}/likes/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: id }),
      }
    );
    return true;
  } catch {
    return false;
  }
};
