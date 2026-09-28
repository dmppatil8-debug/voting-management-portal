package com.voting.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Getter @Setter @NoArgsConstructor
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"election_id","name"}))
public class Candidate {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(length=1000) private String manifesto;
 @ManyToOne(optional=false) @JoinColumn(name="election_id") private Election election;
}
