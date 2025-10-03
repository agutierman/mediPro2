import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";

//Datos de usuario
type Usuario = {
  idUsuario: number;
  usuario: string;
  tipo: number;
};

export default function CitasScreen() {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [page, setPage] = useState(0);
  //Cantidad de registros que se muestran por pagina
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        //Hacer el request
        const res = await fetch("http://localhost:3000/usuarios"); 
        const data = await res.json();
        //Si se reciben los datos, guardarlos en usuarios
        if (data.ok) {
          setUsuarios(data.data);
          console.log(data);
        }
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios registrados</Text>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title style={styles.column}>ID</DataTable.Title>
          <DataTable.Title style={styles.column}>Usuario</DataTable.Title>
          <DataTable.Title style={styles.column}>Tipo</DataTable.Title>
        </DataTable.Header>

        {usuarios
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
          .map((u) => (
            <DataTable.Row key={u.idUsuario}>
              <DataTable.Cell style={styles.column} numeric>{u.idUsuario}</DataTable.Cell>
              <DataTable.Cell style={styles.column}>{u.usuario}</DataTable.Cell>
              <DataTable.Cell style={styles.column} numeric>{u.tipo}</DataTable.Cell>
            </DataTable.Row>
          ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(usuarios.length / itemsPerPage)}
          onPageChange={(p) => setPage(p)}
          label={`${page * itemsPerPage + 1}-${Math.min(
            (page + 1) * itemsPerPage,
            usuarios.length
          )} de ${usuarios.length}`}
        />
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  column: {
    flex: 1,                 // Todas las columnas tienen el mismo ancho
    justifyContent: "center", // Centrado vertical
    alignItems: "center",     // Centrado horizontal
  },
});