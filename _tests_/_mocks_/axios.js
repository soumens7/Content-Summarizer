// _tests_/__mocks__/axios.js
const mockAxios = {
    post: jest.fn(() => Promise.resolve({ data: [{ summary_text: "mock summary" }] })),
    get: jest.fn(),
  };
  
  export default mockAxios;
  