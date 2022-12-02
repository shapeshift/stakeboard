FROM rust:latest

WORKDIR /usr/src/syncer

COPY . .

RUN cargo build --release

RUN cargo install --path .

CMD ["/usr/local/cargo/bin/syncer"]