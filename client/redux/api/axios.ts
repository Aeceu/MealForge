import axios from "axios";

const LocalUrl = "http://localhost:4200/api/v1";

export default axios.create({
	baseURL: LocalUrl,
});
