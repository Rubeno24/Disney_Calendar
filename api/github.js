export default async function handler(req, res) {
    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { filename, content, action, sha } = req.body; // don't JSON.parse
  
      console.log("Incoming request:", { filename, action, hasContent: !!content, sha });
  
      const url = `https://api.github.com/repos/${process.env.GITHUB_USER}/${process.env.GITHUB_REPO}/contents/images/${filename}`;
  
      const body = {
        message: `${action === "delete" ? "Delete" : "Add"} ${filename}`,
        branch: "main",
      };
  
      if (action === "upload") body.content = content;
      if (action === "delete") body.sha = sha;
  
      console.log("Sending to GitHub:", { url, body });
  
      const ghRes = await fetch(url, {
        method: action === "delete" ? "DELETE" : "PUT",
        headers: {
          "Authorization": `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const data = await ghRes.json();
  
      console.log("GitHub response:", ghRes.status, data);
  
      return res.status(ghRes.status).json(data);
    } catch (err) {
      console.error("Function error:", err);
      return res.status(500).json({ error: err.message });
    }
  }
  