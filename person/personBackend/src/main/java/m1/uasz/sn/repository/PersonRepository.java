package m1.uasz.sn.repository;

import m1.uasz.sn.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    // JpaRepository fournit toutes les méthodes CRUD par défaut
}
