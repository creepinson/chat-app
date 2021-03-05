import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./app.scss";
import {
    Text,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Heading,
} from "@chakra-ui/react";

const socket = io(`${process.env.API || "localhost:8080"}`);

export default function App() {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        socket.on("message", (m: string) => setMessages([...messages, m]));
    }, [messages]);

    return (
        <Flex
            bg="gray.800"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minH="200"
        >
            <Text mb="1em">Rollup + TypeScript + Socket.io + React = ❤️</Text>
            <FormControl id="message" w="75" mb="1em">
                <FormLabel>Message</FormLabel>
                <Input
                    color="white"
                    type="text"
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                />
            </FormControl>
            <Button
                mb="1em"
                onClick={() => socket.emit("sendMessage", message)}
            >
                Send
            </Button>
            <Heading>Messages: </Heading>
            <Flex
                p="2em"
                id="messageList"
                flexDirection="column"
                bg="gray.700"
                w="full"
                minH="100"
            >
                {messages.map((m, i) => (
                    <Text key={i}>{m}</Text>
                ))}
            </Flex>
        </Flex>
    );
}
