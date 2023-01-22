import axios from "axios";
import { apiGatewayUrl } from "../components/constants";

axios.defaults.withCredentials = true;

export async function GetQuestionByUsername(username: string, setQuestion: React.Dispatch<React.SetStateAction<string>>){
    return await axios.get(`${apiGatewayUrl}/api/user/${username}/question`).then((resp)=>setQuestion(resp.data.question));
}

export async function VerifyAnswer(username: string, answer : string, newPassword: string){
    await axios.post(`${apiGatewayUrl}/api/user/${username}/answer`, {answer: answer, newPassword : newPassword});
}