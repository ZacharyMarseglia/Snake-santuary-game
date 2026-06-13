export class ApiClient {
  async request(path, options) {
    const response = await fetch(path, options);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return response.json();
  }

  createPlayer(name) {
    return this.request("/api/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
  }

  load(playerId) {
    return this.request(`/api/save/${playerId}`);
  }

  save(playerId, save) {
    return this.request(`/api/save/${playerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ save })
    });
  }

  reset(playerId) {
    return this.request(`/api/reset/${playerId}`, { method: "POST" });
  }
}
