import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useProperties } from "../../../../context/PropertyContex";
import { ArrowLeft } from "lucide-react";

dayjs.extend(utc);

const COLORS = {
  PRIMARY: "#2563eb",
  SECONDARY: "#3b82f6",
  ACCENT: "#1d4ed8",
  BACKGROUND: "#f8fafc",
  ERROR: "#ef4444",
  SUCCESS: "#22c55e",
  TEXT: {
    PRIMARY: "#0f172a",
    SECONDARY: "#475569",
    LIGHT: "#94a3b8",
  },
};

const styles = {
  mainContainer: { minHeight: '100vh', padding: '2rem', background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)' },
  formContainer: { maxWidth: '1200px', margin: '0 auto', position: 'relative' },
  formCard: { padding: '2rem', borderRadius: '1rem', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  formTitle: { textAlign: 'center', fontWeight: '600', fontSize: '1.875rem', color: COLORS.TEXT.PRIMARY, marginBottom: '2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  inputGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem', color: COLORS.TEXT.SECONDARY },
  input: { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' },
  textarea: { minHeight: '120px', resize: 'vertical' },
  error: { color: COLORS.ERROR, fontSize: '0.75rem', marginTop: '0.25rem' },
  imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' },
  imagePreview: { width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0' },
  button: { padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', color: 'white', background: COLORS.PRIMARY },
};

const tiposInmueble = [
  "Casa",
  "Apartamento",
  "Local",
  "Oficina",
  "Bodega",
  "Lote",
  "Finca"
];

const tiposNegocio = [
  "Venta",
  "Arriendo",
  "Arriendo/Venta"
];

const estados = [
  "Nuevo",
  "Usado",
  "En construcción",
  "Sobre planos"
];

export const PropertyForm = () => {
  const { createProperty, getProperty, updateProperty } = useProperties();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedImages, setSelectedImages] = useState([]);
  const [serverError, setServerError] = useState("");
  
  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      pais: "",
      departamento: "",
      ciudad: "",
      zona: "",
      areaConstruida: "",
      areaTerreno: "",
      areaPrivada: "",
      alcobas: "",
      costo: "",
      banos: "",
      garaje: "",
      estrato: "",
      piso: "",
      tipoInmueble: "",
      tipoNegocio: "",
      estado: "",
      valorAdministracion: "",
      anioConstruccion: "",
      description: "",
      images: [],
    }
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const formData = new FormData();
      selectedImages.forEach((image) => formData.append("images", image));
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (params.id) await updateProperty(params.id, formData);
      else await createProperty(formData);

      navigate("/properties");
    } catch (error) {
      setServerError("Error al procesar la solicitud");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files].slice(0, 15));
    setValue("images", selectedImages);
  };

  useEffect(() => {
    const loadProperty = async () => {
      if (params.id) {
        try {
          const property = await getProperty(params.id);
          Object.keys(property).forEach((key) => {
            if (key === "images") {
              setSelectedImages(property[key]);
            } else {
              setValue(key, property[key]);
            }
          });
        } catch (error) {
          setServerError("No se pudo cargar la propiedad");
        }
      }
    };
    loadProperty();
  }, [params.id, setValue, getProperty]);

  const renderField = (field, options = {}) => {
    const { type = "text", select = false, options: selectOptions = [] } = options;
    
    // Configuración de validación para campos numéricos
    const getNumericValidation = () => ({
      required: field.required ? "Este campo es requerido" : false,
      min: { 
        value: 0, 
        message: "El valor no puede ser negativo" 
      },
      validate: {
        positive: value => value >= 0 || "El valor no puede ser negativo",
        integer: field.integer ? value => Number.isInteger(Number(value)) || "El valor debe ser un número entero" : undefined
      }
    });

    return (
      <div key={field.name} style={styles.inputGroup}>
        <label style={styles.label} htmlFor={field.name}>
          {field.label}
          {field.required && <span style={{ color: COLORS.ERROR }}> *</span>}
        </label>
        <Controller
          name={field.name}
          control={control}
          rules={type === "number" ? getNumericValidation() : { required: field.required ? "Este campo es requerido" : false }}
          render={({ field: { onChange, value, ref } }) => {
            if (select) {
              return (
                <select
                  style={styles.input}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                >
                  <option value="">Seleccione una opción</option>
                  {selectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            }
            
            if (field.name === "description") {
              return (
                <textarea
                  style={{...styles.input, ...styles.textarea}}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              );
            }

            return (
              <input
                style={styles.input}
                type={type}
                onChange={(e) => {
                  // Para campos numéricos, prevenir valores negativos en el input
                  if (type === "number" && e.target.value < 0) {
                    e.target.value = 0;
                  }
                  onChange(e);
                }}
                min={type === "number" ? 0 : undefined}
                value={value}
                ref={ref}
                step={field.integer ? "1" : "any"}
              />
            );
          }}
        />
        {errors[field.name] && (
          <span style={styles.error}>{errors[field.name].message}</span>
        )}
      </div>
    );
  };

  const fields = [
    { name: "title", label: "Título", required: true },
    { name: "pais", label: "País", required: true },
    { name: "departamento", label: "Departamento", required: true },
    { name: "ciudad", label: "Ciudad", required: true },
    { name: "zona", label: "Zona", required: true },
    { name: "areaConstruida", label: "Área Construida (m²)", required: true, type: "number" },
    { name: "areaTerreno", label: "Área Terreno (m²)", required: true, type: "number" },
    { name: "areaPrivada", label: "Área Privada (m²)", required: true, type: "number" },
    { name: "alcobas", label: "Alcobas", required: true, type: "number", integer: true },
    { name: "costo", label: "Costo", required: true, type: "number" },
    { name: "banos", label: "Baños", required: true, type: "number", integer: true },
    { name: "garaje", label: "Garajes", required: true, type: "number", integer: true },
    { name: "estrato", label: "Estrato", required: true, type: "number", integer: true },
    { name: "piso", label: "Piso", required: true, type: "number", integer: true },
    { name: "tipoInmueble", label: "Tipo de Inmueble", required: true, select: true, options: tiposInmueble },
    { name: "tipoNegocio", label: "Tipo de Negocio", required: true, select: true, options: tiposNegocio },
    { name: "estado", label: "Estado", required: true, select: true, options: estados },
    { name: "valorAdministracion", label: "Valor Administración", required: true, type: "number" },
    { name: "anioConstruccion", label: "Año de Construcción", required: true, type: "number", integer: true },
    { name: "description", label: "Descripción", required: true }
  ];

  return (
    <div style={styles.mainContainer}>
      <div style={styles.formContainer}>
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '-4rem', left: '0', padding: '0.75rem 1.25rem' }}>
          <ArrowLeft size={18} /> Volver
        </button>

        <div style={styles.formCard}>
          <h1 style={styles.formTitle}>{params.id ? "Editar Propiedad" : "Nueva Propiedad"}</h1>
          {serverError && <div style={styles.error}>{serverError}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.formGrid}>
              {fields.map((field) => renderField(field, {
                type: field.type,
                select: field.select,
                options: field.options
              }))}
            </div>

            {/* Image Upload Section */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Subir Imágenes</label>
              <input type="file" multiple onChange={handleImageChange} accept="image/*" />
              <div style={styles.imageGrid}>
                {selectedImages.map((image, index) => (
                  <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} style={styles.imagePreview} />
                ))}
              </div>
            </div>

            <button type="submit" style={styles.button}>
              {params.id ? "Actualizar Propiedad" : "Crear Propiedad"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};