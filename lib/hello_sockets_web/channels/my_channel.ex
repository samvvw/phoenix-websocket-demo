
defmodule HelloSocketsWeb.MyChannel do
  use Phoenix.Channel
  alias HelloSocketsWeb.Presence

  def join("topic:subtopic", payload, socket) do
    name = payload["name"]
    send(self(), :after_join)
    {:ok, assign(socket, :name, name)}
  end

  def handle_in("event", payload, socket) do
    broadcast socket, "wow", payload
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, socket.assigns.name, %{
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # intercept ["event"]
  # @impl true
  def handle_out("event-response", payload, socket) do
    IO.inspect("Got event-reply: #{inspect(payload)}")
    push(socket, "event-response", payload)
    {:noreply, socket}
  end
end
