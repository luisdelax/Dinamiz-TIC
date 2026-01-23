import { useEffect, useState } from "react";

export default function ComputerForm({ onSubmit, onCancel, initialData, persons, classrooms, sites }) {
  const [form, setForm] = useState({
    asset_tag: "",
    brand: "",
    model: "",
    status: "active",
    assigned_to_person: "",
    assigned_to_classroom: "",
    site: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        assigned_to_person: initialData.assigned_to_person || "",
        assigned_to_classroom: initialData.assigned_to_classroom || "",
        site: initialData.site || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...form };
    if (dataToSend.assigned_to_person === "") {
      dataToSend.assigned_to_person = null;
    }
    if (dataToSend.assigned_to_classroom === "") {
      dataToSend.assigned_to_classroom = null;
    }
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="asset_tag"
        placeholder="Código de activo"
        value={form.asset_tag}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        name="brand"
        placeholder="Marca"
        value={form.brand}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        name="model"
        placeholder="Modelo"
        value={form.model}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="active">Activo</option>
        <option value="maintenance">Mantenimiento</option>
        <option value="retired">Retirado</option>
      </select>

      <select
        name="assigned_to_person"
        value={form.assigned_to_person}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Sin asignar (Persona)</option>
        {persons.map((person) => (
          <option key={person.id} value={person.id}>
            {person.first_name} {person.last_name}
          </option>
        ))}
      </select>

      <select
        name="assigned_to_classroom"
        value={form.assigned_to_classroom}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Sin asignar (Aula)</option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
        
        <select
        name="site"
        value={form.site}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="">Seleccione una sede</option>
        {sites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-gray"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
