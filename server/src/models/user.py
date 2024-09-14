import uuid
from sqlalchemy import Column, String,Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID  # For PostgreSQL
from sqlalchemy.dialects.mysql import CHAR  # For MySQL
from sqlalchemy.types import TypeDecorator
from sqlalchemy import func

Base = declarative_base()

# Custom UUID class to support MySQL
class GUID(TypeDecorator):
    """Platform-independent GUID type for use with UUIDs."""

    impl = CHAR(36)

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return str(value)
        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(value)

class User(Base):
  __tablename__ = 'users'

  id = Column(GUID(), primary_key=True, default=uuid.uuid4)
  username = Column(String(250),unique=True,nullable=False)
  firstName = Column(String(250),unique=True,nullable=False)
  lastName = Column(String(250),unique=True,nullable=False)
  email = Column(String(120),unique=True,nullable=False)
  password = Column(String(250),nullable=False)
  refreshToken = Column(Text,nullable=True)

  def __repr__(self):
    return f"<User(firstName={self.firstName},lastName={self.lastName}, email={self.email})"
