import React from "react";
import "./Options.css";

export const Options = () => {
	return (
		<div>
			<div className="options">
				<div className="add-todo">
					<input
						type="text"
						name="input"
						placeholder="Add a new to-do"
					/>
				</div>
			</div>
		</div>
	);
};
