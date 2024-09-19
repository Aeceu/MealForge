import axios from "axios";

const LocalUrl = "http://192.168.0.100:4200";

export default axios.create({
	baseURL: LocalUrl,
});
