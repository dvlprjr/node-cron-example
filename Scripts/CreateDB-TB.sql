/* ============================================================
   1) CREAR BASE DE DATOS
============================================================ */
IF DB_ID('FondoCron') IS NULL
BEGIN
    CREATE DATABASE FondoCron;
END
GO

USE FondoCron;
GO

/* ============================================================
   2) SEQUENCES (para IDs automáticos sin IDENTITY)
============================================================ */

CREATE SEQUENCE dbo.SeqPersonaId AS INT START WITH 1 INCREMENT BY 1;
GO

CREATE SEQUENCE dbo.SeqTransaccionId AS BIGINT START WITH 1 INCREMENT BY 1;
GO

/* ============================================================
   3) TABLA PERSONA
============================================================ */
CREATE TABLE dbo.Persona (
    PersonaId INT NOT NULL PRIMARY KEY
        DEFAULT (NEXT VALUE FOR dbo.SeqPersonaId),

    Nombre NVARCHAR(120) NOT NULL,
    Email NVARCHAR(200) NULL,
    Activa BIT NOT NULL DEFAULT (1),

    FechaCreado DATETIME2(0) NOT NULL DEFAULT (SYSUTCDATETIME())
);
GO

/* ============================================================
   4) CONTADOR POR PERSONA
============================================================ */
CREATE TABLE dbo.PersonaContador (
    PersonaId INT NOT NULL PRIMARY KEY,
    NextTransaccionNumero INT NOT NULL DEFAULT (1),

    CONSTRAINT FK_PersonaContador_Persona
        FOREIGN KEY (PersonaId)
        REFERENCES dbo.Persona(PersonaId)
);
GO

/* ============================================================
   5) TABLA TRANSACCION
============================================================ */
CREATE TABLE dbo.Transaccion (
    TransaccionId BIGINT NOT NULL PRIMARY KEY
        DEFAULT (NEXT VALUE FOR dbo.SeqTransaccionId),

    PersonaId INT NOT NULL,
    TransaccionNumero INT NOT NULL,

    Fecha DATETIME2(0) NOT NULL DEFAULT (SYSUTCDATETIME()),
    Tipo NVARCHAR(30) NOT NULL, -- APORTE, RETIRO, CRON_DEMO
    Monto DECIMAL(18,2) NOT NULL,
    Descripcion NVARCHAR(300) NULL,

    CONSTRAINT FK_Transaccion_Persona
        FOREIGN KEY (PersonaId)
        REFERENCES dbo.Persona(PersonaId),

    CONSTRAINT UQ_Persona_Numero
        UNIQUE (PersonaId, TransaccionNumero)
);
GO

/* ============================================================
   6) INSERT DE PRUEBA
============================================================ */
INSERT INTO dbo.Persona (Nombre, Email)
VALUES ('Cesar Herrera', 'cesar@test.com');
GO

-- Inicializamos contador para la persona creada
INSERT INTO dbo.PersonaContador (PersonaId)
SELECT PersonaId FROM dbo.Persona;
GO

