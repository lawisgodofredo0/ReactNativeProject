import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 15,
  },
  searchBar: {
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },
  card: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#fff",
  },
  image: {
    height: 200,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3142",
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#FF6F61",
    borderRadius: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 10,
  },
  modalSub: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2D3142",
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  exitBtn: {
    borderColor: "#FF6F61",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 5,
  },
});
