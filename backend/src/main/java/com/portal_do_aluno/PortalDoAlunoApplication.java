package com.portal_do_aluno;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PortalDoAlunoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortalDoAlunoApplication.class, args);
	}

}
