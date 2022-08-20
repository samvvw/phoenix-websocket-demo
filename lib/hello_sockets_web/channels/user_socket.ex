defmodule HelloSocketsWeb.UserSocket do
  use Phoenix.Socket
  channel "topic:subtopic", HelloSocketsWeb.MyChannel

  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
