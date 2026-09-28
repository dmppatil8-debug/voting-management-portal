package com.voting.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Getter @Setter @NoArgsConstructor
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"voter_id","election_id"}))
public class Vote {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) @JoinColumn(name="voter_id") private User voter;
 @ManyToOne(optional=false) @JoinColumn(name="election_id") private Election election;
 @ManyToOne(optional=false) @JoinColumn(name="candidate_id") private Candidate candidate;
 @Column(nullable=false) private LocalDateTime votedAt;
}
