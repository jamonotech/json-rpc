package m1.uasz.sn.controller;

import com.googlecode.jsonrpc4j.JsonRpcServer;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import m1.uasz.sn.service.PersonService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;

@Controller
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;
    private JsonRpcServer jsonRpcServer;

    @PostConstruct
    public void init() {
        jsonRpcServer = new JsonRpcServer(personService, PersonService.class);
    }

    @PostMapping(value = "/jsonrpc/person", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public void handleJsonRpc(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        jsonRpcServer.handle(request, response);
    }
}
