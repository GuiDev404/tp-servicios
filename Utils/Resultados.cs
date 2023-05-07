namespace Ezpeleta2023.Utils
{
    public enum Resultados
    {
        Ok,
        Requerido,
        Existente, // existe uno con el mismo valor
        NotFound,
        // NoEliminadoNotFound,
        NoEliminadoExistenteOtraTabla
    }
}