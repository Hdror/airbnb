import React from "react";

import { StayList } from "../cmps/stay-list.jsx";

export class StayApp extends React.Component {
    state = {

    }


    render() {
        return <section className="main-container">
            <h1>Stay App</h1>
            <StayList />
        </section>
    }
}