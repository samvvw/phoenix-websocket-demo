defmodule HelloSocketsWeb.ChatController do
  use HelloSocketsWeb, :controller
  alias HelloSocketsWeb.MyChannel, as: MyChannel

  def index(conn, _params) do
    HelloSocketsWeb.Endpoint.broadcast!("topic:subtopic", "event-response", %{message: "Hello from the server sucket!"})
    json(conn, %{message: "Hello from the server"})
  end
end
