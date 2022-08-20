import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :hello_sockets, HelloSocketsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "W8w3UFz7CL1jCsdpozp4AnYSM1lrVkwDkDzxg+Hj+Mx002qpdQmgMa43CetKojXy",
  server: false

# In test we don't send emails.
config :hello_sockets, HelloSockets.Mailer,
  adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
