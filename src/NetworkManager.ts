const NetworkManager = {
  async makeGetRequest(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err);
      return {};
    }
  },
};

export default NetworkManager;
