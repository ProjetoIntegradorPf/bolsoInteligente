import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Table from './components/Table';
import ExpenseCategory from './components/ExpenseCategory';
import BasePage from './components/BasePage';
import RevenueCategory from './components/RevenueCategory';

function MainRoutes() {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/home" element={<App />} />
			<Route
				path="/relatorio-geral"
				element={
					<BasePage>
						<Table key="relatorio-geral" />
					</BasePage>
				}
			/>
			<Route
				path="/categoria-despesa"
				element={
					<BasePage>
						<ExpenseCategory />
					</BasePage>
				}
			/>
			<Route
				path="/categoria-receita"
				element={
					<BasePage>
						<RevenueCategory />
					</BasePage>
				}
			/>
			<Route
				path="/despesas"
				element={
					<BasePage>
						<Table key="despesas" />
					</BasePage>
				}
			/>
			<Route
				path="/receitas"
				element={
					<BasePage>
						<Table key="receitas" />
					</BasePage>
				}
			/>
			{/* <Route
                path="/investimentos"
                element={<BasePage><Table key="investimentos" /></BasePage>}
            /> */}
		</Routes>
	);
}

export default MainRoutes;
