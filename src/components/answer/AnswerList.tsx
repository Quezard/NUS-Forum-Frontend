import AnswerItem from "./AnswerItem";
import VoteDisplay from "../VoteDisplay";
import EditBar from "../EditBar";
import Item from "../Item";
import { Question, emptyQuestion } from "../../types/Question";
import { Answer } from "../../types/Answer";
import { getQuestionDetail, updateQuestion } from "../../lib/api/question";
import { createAnswer, getAnswersOfQuestion } from "../../lib/api/answer";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AnswerList: React.FC = () => {
    /*
        Structure: 
        - Card containing question title and body
        - AnswerItems
        - user answer
    */

    // get question ID from URL
    function getQuestionID(): number {
        const { id } = useParams();
        if (id) {
            return +id;
        } else {
            return -1;
        }
    }

    const questionID: number = getQuestionID();
    const [question, setQuestion] = useState<Question>(emptyQuestion);
    const [Answers, setAnswers] = useState<Answer[]>([]);
    const [userAnswer, setUserAnswer] = useState("");

    useEffect(() => {
        // Fetch the question
        getQuestionDetail(questionID).then((data) => {
            if (data) {
                setQuestion(data);
            } else {
                //handle not found
            }
        });

        // fetch answers
        getAnswersOfQuestion(questionID).then((data) => {
            if (data) {
                setAnswers(data);
            } else {
                //handle not found
            }
        });
    }, []);

    async function handleQuestionVoteChange(change: number) {
        // update display
        const newQuestion = structuredClone(question);
        newQuestion.votes += change;
        setQuestion(newQuestion);

        // update backend
        try {
            await updateQuestion(questionID, newQuestion);
        } catch (error) {
            console.error(error);
        }
    }

    function handleUserAnswerChange(event: React.ChangeEvent<HTMLInputElement>) {
        const text: string = event.target.value;
        setUserAnswer(text);
    }

    function handleAnswerVoteChange(answerID: number, change: number) {
        // update vote of target answer
        const newAnswers: Answer[] = [];
        for (let i = 0; i < Answers.length; i++) {
            newAnswers[i] = Answers[i];
            if (Answers[i].answerID === answerID) {
                newAnswers[i].votes += change;
            }
        }
        setAnswers(newAnswers);

        // update backend
    }

    async function handleUserAnswerSubmit() {
        if (userAnswer) {
            // update backend
            try {
                // create new answer and submit to API
                const newAnswer: Answer = {
                    answerID: 0,
                    questionID: questionID,
                    body: userAnswer,
                    author: "tester",
                    createdAt: "",
                    updatedAt: "",
                    votes: 0,
                    accepted: false,
                };
                await createAnswer(newAnswer);

                // reload page
                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Your answer cannot be empty");
        }
    }

    if (question.id === -1) {
        return <div></div>;
    }

    return (
        <Box className="centerBox" sx={{ flexGrow: 1, p: 3 }} top={80}>
            <Box padding={1}>
                <Card variant="outlined">
                    <CardContent>
                        <Box display={"flex"} flexDirection={"row"}>
                            <VoteDisplay
                                votes={question.votes}
                                accepted={false}
                                handleVoteChange={handleQuestionVoteChange}
                            />
                            <Box display={"flex"} flexDirection={"column"} width="100%">
                                <Typography variant="h5" p={0}>
                                    {question.title}
                                </Typography>
                                <Typography>
                                    by {question.author} on {question.createdAt}
                                </Typography>
                                <Stack direction="row" spacing={1} paddingTop={1} paddingBottom={1}>
                                    {question.tags.map((tag: string) => (
                                        <Item sx={{ backgroundColor: "#777", color: "#fff" }} key={tag}>
                                            {tag}
                                        </Item>
                                    ))}
                                </Stack>
                                <Divider />
                                <Typography p={1} minHeight="3vw" style={{ whiteSpace: "pre-line" }}>
                                    {question.body}
                                </Typography>
                                <EditBar allowEdit={true} allowDelete={true} />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Typography variant="h5" padding={2}>
                Answers
            </Typography>
            {Answers.map((answer: Answer) => (
                <AnswerItem answer={answer} handleVoteChange={handleAnswerVoteChange} key={answer.answerID} />
            ))}
            <Typography variant="h5" padding={2}>
                Your Answer
            </Typography>
            <Box padding={1} sx={{ "& .MuiTextField-root": { width: "100ch" } }}>
                <TextField
                    id="userAnswer"
                    multiline
                    required
                    rows={8}
                    placeholder="Write your answer here"
                    onChange={handleUserAnswerChange}
                />
                <Box position="relative" top={10} alignContent="center">
                    <Button variant="contained" onClick={handleUserAnswerSubmit}>
                        Post Answer
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AnswerList;
