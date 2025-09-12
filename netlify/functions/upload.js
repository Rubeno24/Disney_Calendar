import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { filename, content } = JSON.parse(event.body);

    const url = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/images/${filename}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Add ${filename}`,
        content: content,
        branch: "main"
      })
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
