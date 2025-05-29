import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import CreateForm from "../components/CreateForm/createForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.post("http://localhost:3001/records", (req: any, res: any, ctx: any) => {
    return res(ctx.json({ id: 101, ...(req.body as any) }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

test("Добавление новой записи через форму", async () => {
  renderWithClient(<CreateForm />);

  fireEvent.change(screen.getByPlaceholderText(/Имя/i), { target: { value: "Test User" } });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByPlaceholderText(/Возраст/i), { target: { value: 25 } });
  fireEvent.change(screen.getByPlaceholderText(/Адрес/i), { target: { value: "Москва" } });
  fireEvent.change(screen.getByPlaceholderText(/Телефон/i), { target: { value: "+79990001122" } });

  fireEvent.click(screen.getByRole("button", { name: /создать/i }));

  await waitFor(() => {
    expect(screen.queryByText("Отправка...")).not.toBeInTheDocument();
  });
});