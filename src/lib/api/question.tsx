import client from "./client";
import { Question } from "../../types/Question";
import loadHeader from "../helper/loadHeader";
import { serializeCreate, serializeUpdate } from "../serializers/QuestionSerializer";
import { deserializeQuestion, deserializeQuestionList } from "../serializers/QuestionDeserializer";

// get
export const getQuestionList = () => {
    const header = loadHeader(true);
    const response = client.get("/questions?include=user&fields[user]=name", { headers: header });
    return response.then((res) => deserializeQuestionList(res.data)).catch((err) => console.error(err));
};

// detail
export const getQuestionDetail = (id: number) => {
    const header = loadHeader(true);
    const response = client.get(`/questions/${id}?include=user&fields[user]=name`, { headers: header });
    return response.then((res) => deserializeQuestion(res.data)).catch((err) => console.error(err));
};

// create  (need token authentication)
export const createQuestion = (q: Question) => {
    const header = loadHeader();
    const params = serializeCreate(q);
    return client.post("/questions", params, { headers: header });
};

// update  (need token authentication)
export const updateQuestion = (id: number, q: Question) => {
    const header = loadHeader();
    const params = serializeUpdate(q);
    return client.put(`/questions/${id}`, params, { headers: header });
};

// vote (need token authentication)
export const voteQuestion = (id: number, vote: number) => {
    const header = loadHeader();
    // update user vote
    return client.put(`/questions/${id}/vote`, { question: { vote: vote } }, { headers: header });
};

// delete  (need token authentication)
export const deleteQuestion = (id: number) => {
    const header = loadHeader();
    return client.delete(`/questions/${id}`, { headers: header });
};
