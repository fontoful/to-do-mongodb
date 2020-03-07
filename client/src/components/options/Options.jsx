import React from "react";
import "./Options.css";

export const Options = () => {
	return (
		<form>
			<div className="options">
				<div className="add-todo">
					<input
						type="text"
						name="input"
						placeholder="Add a new to-do"
					/>
				</div>
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
		</form>
	);
};
