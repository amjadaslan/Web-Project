import axios from "axios";
import { apiGatewayUrl } from "../components/constants";

axios.defaults.withCredentials = true;

export const SendSignUpRequest = async (username: any, password: any, question: any, answer: any) => {
    await axios({
        method: 'POST',
        url: `${apiGatewayUrl}/api/user/signup`,
        data: {
          "username": username,
          "password": password,
          "question": question,
          "answer": answer
        }
      }).then(response => {
        console.log({
          username: response.data.username
        });
      }).catch((error) => {
        console.log(error);
      });
}