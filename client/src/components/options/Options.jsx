import React from "react";
import "./Options.css";

export const Options = () => {
    return (
        <div className="options">
            <form>
                <input type="text" name="input" placeholder="Add a new to-do" />
            </form>
            <div className="lists">
                <h2>LISTS</h2>
                <nav>
                    <ul>
                        <li>Home</li>
                        <li>Work</li>
                        <li>Studies</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
