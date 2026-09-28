package com.voting.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Getter @Setter @NoArgsConstructor
public class Election {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String title;
 @Column(length=1000) private String description;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private ElectionStatus status = ElectionStatus.DRAFT;
 private LocalDateTime startTime;
 private LocalDateTime endTime;
}
