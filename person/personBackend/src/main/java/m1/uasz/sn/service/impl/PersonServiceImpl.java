package m1.uasz.sn.service.impl;

import m1.uasz.sn.model.Person;
import m1.uasz.sn.repository.PersonRepository;
import m1.uasz.sn.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;

    @Override
    public Person addPerson(Person person) {
        return personRepository.save(person);
    }

    @Override
    public Person getPerson(Long id) {
        return personRepository.findById(id).orElse(null);
    }

    @Override
    public Person editPerson(Long id, Person person) {
        person.setId(id);
        return personRepository.save(person);
    }

    @Override
    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

    @Override
    public List<Person> listPerson() {
        return personRepository.findAll();
    }
}
