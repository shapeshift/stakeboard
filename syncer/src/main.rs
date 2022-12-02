use std::collections::HashMap;
use std::{thread, time, env};
use std::io::Write;
use chrono::Local;
use env_logger::Builder;
use log::LevelFilter;


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    configure_logging();

    let time: u64 = env::var("SLEEP_DURATION").unwrap_or("5".to_string()).parse().unwrap();
    let sleep_duration = time::Duration::from_secs(time);
    let stakeboard_host = env::var("STAKEBOARD_HOST").unwrap();    
    
    loop {
        log::info!("Calling {}", stakeboard_host);
        let resp = reqwest::get(format!("{stakeboard_host}/api/sync"))
            .await?;


        //     .json::<HashMap<String, String>>()
        //     .await?;
        // log::info!("{:#?}", resp);

        log::info!("Sleeping for {:#?} seconds", sleep_duration);
        thread::sleep(sleep_duration);
    }
}


fn configure_logging() {
    Builder::new()
    .format(|buf, record| {
        writeln!(buf,
            "{} [{}] - {}",
            Local::now().format("%Y-%m-%dT%H:%M:%S"),
            record.level(),
            record.args()
        )
    })
    .filter(None, LevelFilter::Info)
    .init();
}
