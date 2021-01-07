import { RequestOptions } from "http";
import { WDAPIDef, RequestDef } from "../interface/interface";
import { WebDriverRequest, WebElement } from "../webdriver";

export class W3C implements WDAPIDef {


    private static _initHttpOptions(request : RequestDef) {
        request.requestOptions.headers = {
            "Content-Type" : "application/json;charset=utf-8",
            "Cache-Control" : "no-cache"
        }
    }

    SESSION_START(browser: string, headless: boolean): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.data = { capabilities : {
            browserName : browser
        } };
        let browerOptions = "browserOptions";
        switch (browser) {
            case "chrome" : 
                browerOptions = "goog:chromeOptions";
        }
        result.data.capabilities[browerOptions] = { args : new Array()};
        if (headless)
            result.data.capabilities[browerOptions].args.push("--headless");
        result.data.capabilities[browerOptions].w3c = true;
        result.path = "/session";
        result.requestOptions = { method : "POST" }
        return result;
    }

    SESSION_STOP(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}`;
        result.requestOptions = { method : "DELETE" }
        return result;
    }

    NAVIGATE_TO(sessionId: string, url: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/url`;
        result.requestOptions = { method : "POST" }
        result.data = {}
        result.data = { url }
        return result;
    }

    NAVIGATE_REFRESH(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/refresh`;
        result.data = {}
        result.requestOptions = { method : "POST" }
        return result;
    }

    NAVIGATE_BACK(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/back`;
        result.data = {}
        result.requestOptions = { method : "POST" }
        return result;
    }

    NAVIGATE_FORWARD(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/back`;
        result.data = {}
        result.requestOptions = { method : "POST" }
        return result;
    }

    WINDOW_GETTITLE(sessionId: string, handle: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/title`;
        result.requestOptions = { method : "GET" }
        return result;
    }
    
    WINDOW_GETHANDLE(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/window`;
        result.requestOptions = { method : "GET" }
        return result;  
    }

    WINDOW_GETHANDLES(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/windows`;
        result.requestOptions = { method : "GET" }
        return result;      
    }

    WINDOW_SETRECT(sessionId: string, handle: string, width: number, height: number): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/window/rect`;
        result.requestOptions = { method : "POST" }
        result.data = {
                width, 
                height
        }
        return result;         
    }

    WINDOW_GETRECT(sessionId: string, handle: string, width: number, height: number): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/window/rect`;
        result.requestOptions = { method : "GET" }
        return result;         
    }

    WINDOW_MAXIMIZE(sessionId: string, handle: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/window/maximize`;
        result.requestOptions = { method : "POST" }
        result.data = {}
        return result;
    }

    WINDOW_MINIMIZE(sessionId: string, handle: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/window/minimize`;
        result.requestOptions = { method : "POST" }
        result.data = {}
        return result;
    }

    WINDOW_FULLSCREEN(sessionId: string, handle: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/window/fullscreen`;
        result.requestOptions = { method : "POST" }
        result.data = {}
        return result;
    }

    WINDOW_CLOSE(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    WINDOW_SWITCH(sessionId: string, handle: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    WINDOW_SCREENSHOT(sessionId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/screenshot`;
        result.requestOptions = { method : "GET" }
        return result;
    }

    FRAME_SWITCH(sessionId: string, frameId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    FRAME_TOPARENT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    FINDELEMENT(sessionId: string, using: string, value: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element`;
        result.requestOptions = { method : "POST" }
        result.data = { using, value }
        return result;  
    }

    FINDELEMENTS(sessionId: string, using: string, value: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element`;
        result.requestOptions = { method : "POST" }
        result.data = { using, value }
        return result;  
    }

    GETACTIVEELEMENT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_FINDELEMENT(sessionId: string, element: string, using: string, value: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_FINDELEMENTS(sessionId: string, element: string, using: string, value: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_GETATTRIBUTE(sessionId: string, elementId: string, attribute: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element/${elementId}/attribute/${attribute}`;
        result.requestOptions = { method : "GET" };
        result.data = { value : attribute }
        return result;  
    }

    ELEMENT_GETPROPERTY(sessionId: string, elementId: string, property: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_GETCSS(sessionId: string, elementId: string, cssProperty: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_GETTEXT(sessionId: string, elementId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element/${elementId}/text`;
        result.requestOptions = { method : "GET" }
        return result;  
    }

    ELEMENT_GETNAME(sessionId: string, elementId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_GETRECT(sessionId: string, elementId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_SCREENSHOT(sessionId: string, elementId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element/${elementId}/screenshot`;
        result.requestOptions = { method : "GET" }
        return result;  
    }

    ELEMENT_CLICK(sessionId: string, elementId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element/${elementId}/click`;
        result.requestOptions = { method : "POST" }
        result.data = {}
        return result;  
    }

    ELEMENT_CLEAR(sessionId: string, elementId: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element/${elementId}/clear`;
        result.requestOptions = { method : "POST" }
        result.data = {}
        return result;  
    }

    ELEMENT_ISENABLED(sessionId: string, elementId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_ISSELECTED(sessionId: string, elementId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ELEMENT_SENDKEYS(sessionId: string, elementId: string, keys: string): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/element/${elementId}/value`;
        result.requestOptions = { method : "POST" }
        result.data = { text : keys }
        return result; 
    }

    EXECUTE_SYNC(sessionId: string, script: string, args: any[]): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/execute/sync`;
        result.requestOptions = { method : "POST" }
        result.data = { script, args }
        return result;
    }

    EXECUTE_ASYNC(sessionId: string, script: string, args: any[]): RequestDef {
        let result = new WebDriverRequest();
        W3C._initHttpOptions(result);
        result.path = `/session/${sessionId}/execute/qsync`;
        result.requestOptions = { method : "POST" }
        result.data = { script, args }
        return result;
    }

    COOKIE_GETALL(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    COOKIE_GET(sessionId: string, name: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    COOKIE_ADD(sessionId: string, name: string, value: string, path: string, domain: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    COOKIE_DELETE(sessionId: string, name: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    COOKIE_DELETEALL(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ALERT_ACCEPT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ALERT_DISMISS(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ALERT_GETTEXT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }

    ALERT_SENDTEXT(sessionId: string): RequestDef {
        throw new Error("Method not implemented.");
    }
}