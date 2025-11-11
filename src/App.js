import React from "react";
import { useState } from "react";
import { useAtom } from "jotai";
import { gameRunningAtom } from "./GlobalState";
import PacMan from "./components/PacMan";
import MLTrain from "./components/MLTrain";
import DataCollection from "./components/DataCollection";
import InteractiveValidation from "./components/InteractiveValidation";
import { useEmotionDetection } from "./model/emotionModule";
import { EmotionContext } from "./model/EmotionContext";

import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
} from "@mui/material";

export default function App() {
    const webcamRef = React.useRef(null);

    // Feature 2
    const [gameRunning] = useAtom(gameRunningAtom);
    const emotionState = useEmotionDetection(webcamRef, true); // once the user starts the camera, the face dectection will run
    const [isEmotionDropdownOpen, setIsEmotionDropdownOpen] = useState(false);

    return (
        <EmotionContext.Provider value={emotionState}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="absolute">
                    <Toolbar
                        sx={{
                            pl: "24px", // left padding
                        }}
                    >
                        <Typography component="h1" variant="h3" color="inherit" noWrap>
                            Control PAC MAN via the camera!
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) => theme.palette.grey[800],
                        flexGrow: 1,
                        height: "100vh",
                        width: "100vw",
                        overflow: "auto",
                    }}
                >
                    <Toolbar />
                    <Container sx={{ paddingTop: 3 }}>
                        <Grid container spacing={3}>

                            {/* Chart */}
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        marginBottom: 3,
                                    }}
                                >
                                    {/* part 1 where we collect training data */}
                                    <DataCollection webcamRef={webcamRef} />
                                </Paper>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        height: 340,
                                    }}
                                >
                                    <MLTrain webcamRef={webcamRef} />
                                </Paper>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        marginTop: 3,
                                    }}
                                >
                                    <InteractiveValidation webcamRef={webcamRef} />
                                </Paper>
                            </Grid>
                            {/* Recent Deposits */}
                            <Grid item xs={12} md={6} lg={6}>
                                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                                    <PacMan />
                                </Paper>
                                {/* Feature 2*/}
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        marginTop: 3,
                                        backgroundColor: emotionState.isAngryDetected ? '#d63737ff' : 'white',
                                        cursor: 'pointer'  // Show it's clickable
                                    }}
                                    onClick={() => setIsEmotionDropdownOpen(!isEmotionDropdownOpen)}
                                >
                                    AngerScore: {(emotionState.angerScore * 100).toFixed(0)}%
                                    <span style={{ marginLeft: '10px' }}>
                                        {isEmotionDropdownOpen ? '▲' : '▼'} See more scores
                                    </span>
                                    <br />
                                </Paper>
                                {isEmotionDropdownOpen && emotionState.emotion && (
                                    <Paper sx={{ p: 2, marginTop: 3 }}>
                                        <Typography variant="h6" gutterBottom>All Emotions:</Typography>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {Object.entries(emotionState.emotion).map(([emotionName, score]) => (
                                                <span
                                                    key={emotionName}
                                                    style={{
                                                        flexBasis: 'calc(33.33% - 10px)',  // 3 items per row
                                                        minWidth: '120px'
                                                    }}
                                                >
                                                    <strong>{emotionName.charAt(0).toUpperCase() + emotionName.slice(1)}:</strong> {(score *
                                                        100).toFixed(0)}%
                                                </span>
                                            ))}
                                        </div>
                                    </Paper>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </EmotionContext.Provider>
    );
}
