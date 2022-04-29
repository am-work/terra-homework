

export default {

    local: {
        url: "http://localhost:1317",
        chainId: "localterra",
        gasAdjustment: "1.5",

    },
    bombay: {
        fcdUrl: "https://bombay-fcd.terra.dev",
        lcdUrl: "https://bombay-lcd.terra.dev", // Use "https://lcd.terra.dev" for prod "http://localhost:1317" for localterra.
        chainId: "bombay-12", // Use "columbus-5" for production or "localterra".
        gasAdjustment: "1.5", // Increase gas price slightly so transactions go through smoothly.
        counterContract: "terra1fq02q6mltx3j7gd5ccta0k9d9mgakrez825fz5",
        cw20Contract: "terra1hpajld8zs93md8zrs6sfy42zl0khqpmr07muw0",
        swapContract: "terra18cxfw00y7x7596j4xcft28hutxp269htl66c9g",
        swap2Contract: "terra1f7vnhhk24jmaxp2tdgf906yy980yg3c4h8f05h",
        oracleContract: "terra1yhlp5zxct4cm0raud2hl72sa6qqejejmehua2q",
    },
    mainnet: {
        url: "https://lcd.terra.dev",
        chainId: "columbus-5",
        gasAdjustment: "1.5",
    }
}
