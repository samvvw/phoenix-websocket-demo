
defmodule HelloSocketsWeb.MyChannel do
  use Phoenix.Channel

  @impl true
  def join("topic:subtopic", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("event", payload, socket) do
    {:reply, {:ok, %{ "reply" => "Pong"}}, socket}
  end

  @impl true
  def handle_out("event-reply", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end
end
