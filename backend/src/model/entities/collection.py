from datetime import datetime
from uuid import UUID
    
class Collection():
    """Clase que representa una colección de usuarios,
      cada uno con un conjunto de posts, a perfilar."""

    def __init__(
        self,
        nombre: str,
        algoritmo: str,
        id: UUID | None = None,
        tiempo: int | None = None,
        users_stats: dict | None = None,
        fecha_creacion: float = datetime.now().timestamp()
    ) -> None:
        self.id = id
        self.nombre = nombre
        self.algoritmo = algoritmo
        self.fecha_creacion = fecha_creacion
        self.tiempo = tiempo
        self.users_stats = users_stats
