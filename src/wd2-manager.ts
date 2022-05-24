import { NodeAPI, NodeAPISettingsWithData } from "node-red";
import wd, { Builder, WebDriver, Session } from "selenium-webdriver";
import { HttpClient, Executor } from 'selenium-webdriver/http'
import * as chrome from "selenium-webdriver/chrome";
import * as firefox from "selenium-webdriver/firefox";
import { NodeOpenWebDef } from "./nodes/node";
import { portCheck } from "./utils";

export class WD2Manager {
    private static _RED: NodeAPI<NodeAPISettingsWithData>;
    private static _serverURL: string = "";
    private static _driverList: WebDriver[] = new Array<WebDriver>();
    private static _session_id: string = null;
    public static get RED() {
        return WD2Manager._RED;
    }

    public static init(RED: NodeAPI<NodeAPISettingsWithData>): void {
        WD2Manager._RED = RED;
    }

    /**
     * Define the configuration of the Selenium Server and return a boolean if the server is reacheable
     * @param serverURL
     * @param browser
     */
    public static async setServerConfig(serverURL: string): Promise<boolean> {
        WD2Manager._serverURL = serverURL;
        const server = serverURL.match(/\/\/([a-z0-9A-Z.:-]*)/)?.[1];
        if (!server)
            return new Promise((resolve) => resolve(false));
        const host = server.split(":")[0];
        const port = server.split(":")[1] || "80";
        return portCheck(host, parseInt(port, 10));
    }
    public static clearDriverList(){
        WD2Manager._driverList = [];
    }
    public static getDriver(conf: NodeOpenWebDef): WebDriver {
        let builder = new Builder().withCapabilities({ browserName: 'chrome', chromeOptions: { w3c: false } }).forBrowser(conf.browser).usingServer(conf.serverURL);
        if (conf.headless) {
            const width = conf.width;
            const height = conf.heigth;
            switch (conf.browser) {
                case 'firefox':
                    builder = builder.setFirefoxOptions(
                        new firefox.Options().headless());
                    break;
                case 'chrome':
                    builder = builder.setChromeOptions(
                        new chrome.Options().headless());
                    break;
                default:
                    WD2Manager._RED.log.warn("unsupported headless configuration for" + conf.browser);
                    break;
            }
        }
        let driver: WebDriver;
        if (WD2Manager._driverList.length >= 1) {
            try {
                driver = this.getExistingBrowser();
            }
            catch (error) {
                createSessionInstance();
                driver = WD2Manager._driverList.pop();
            }
        }
        else {
            createSessionInstance();
        }
        return driver;

        function createSessionInstance() {
            driver = builder.withCapabilities({ browserName: 'chrome', chromeOptions: { w3c: false } }).build();
            driver.getSession().then(function (session) {
                WD2Manager._session_id = session.getId();
            });
            driver.getCapabilities().then(function (c) {
                c.set('w3c', false);
            });
            WD2Manager._driverList.push(driver);
        }
    }

    public static checkIfCritical(error: Error): boolean {
        // Blocking error in case of "WebDriverError : Failed to decode response from marionett"
        if (error.toString().includes("decode response"))
            return true;
        // Blocking error in case of "NoSuchSessionError: Tried to run command without establishing a connection"
        if (error.name.includes("NoSuchSessionError"))
            return true;
        // Blocking error in case of "ReferenceError" like in case of msg.driver is modified
        if (error.name.includes("ReferenceError"))
            return true;
        // Blocking error in case of "TypeError" like in case of msg.driver is modified
        if (error.name.includes("TypeError"))
            return true;
        return false;
    }

    public static getExistingBrowser() {
        const client = new HttpClient(WD2Manager._serverURL);
        const executor = new Executor(client);
        const session = new Session(WD2Manager._session_id, wd.Capabilities.chrome());

        return new WebDriver(session, executor);
    }
    
    public static midpoint(x1:number, y1:number, x2:number, y2:number) {
        return [(x1 + x2) / 2, (y1 + y2) / 2];
    }

}