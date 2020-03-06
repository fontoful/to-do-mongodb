import React from "react";
import "./Header.css";

export const Header = () => {
    return (
        <div>
            <header>
                <div className="icon">
                    <h1>TO-DO APP</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="#"></a>completed
                        </li>
                        <li>
                            <a href="#"></a>trashed
                        </li>
                    </ul>
                </nav>
                <div className="login">
                    <h2>Settings</h2>
                    <i class="far fa-user-circle"></i>
                </div>
            </header>
        </div>
    );
};
