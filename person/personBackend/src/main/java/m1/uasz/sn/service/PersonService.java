package m1.uasz.sn.service;

import m1.uasz.sn.model.Person;
import java.util.List;
import com.googlecode.jsonrpc4j.JsonRpcMethod;

public interface PersonService {
    @JsonRpcMethod("addPerson")
    Person addPerson(Person person);

    @JsonRpcMethod("getPerson")
    Person getPerson(Long id);

    @JsonRpcMethod("editPerson")
    Person editPerson(Long id, Person person);

    @JsonRpcMethod("deletePerson")
    void deletePerson(Long id);

    @JsonRpcMethod("listPerson")
    List<Person> listPerson();
}

