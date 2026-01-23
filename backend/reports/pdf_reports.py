from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4 # Changed to A4 portrait for better detail view
from reportlab.lib.units import inch
from django.http import HttpResponse
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
import requests
import io
from django.conf import settings
import os


def tickets_pdf_report(request, tickets):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_tickets.pdf"'

    doc = SimpleDocTemplate(response, pagesize=A4) # Using A4 for portrait mode
    styles = getSampleStyleSheet()
    # Define a custom style for errors
    styles.add(ParagraphStyle(name='Error',
                             parent=styles['Normal'],
                             textColor='red',
                             fontName='Helvetica-Bold'))
    elements = []

    # Title
    elements.append(Paragraph("Reporte de Tickets IT", styles['Title']))
    elements.append(Spacer(1, 0.2 * inch))

    # Main Tickets Table
    table_data = [
        ["ID", "Título", "Estado", "Prioridad", "Creado Por", "Asignado a", "Fecha Creación", "Fecha Cierre"]
    ]

    for t in tickets:
        table_data.append([
            t.id,
            t.title,
            t.status,
            t.priority,
            t.created_by.username,
            t.assigned_to.username if t.assigned_to else "N/A",
            t.created_at.strftime("%Y-%m-%d %H:%M"),
            t.closed_at.strftime("%Y-%m-%d %H:%M") if t.closed_at else "N/A",
        ])

    table = Table(table_data, hAlign='LEFT')
    elements.append(table)

    # Details and Evidences for each Ticket
    details_elements = []
    for t in tickets:
        if t.evidences.exists():
            details_elements.append(PageBreak()) # Start a new page for detailed evidence

            details_elements.append(Paragraph(f"Detalles y Evidencias para Ticket #{t.id} - {t.title}", styles['h2']))
            details_elements.append(Spacer(1, 0.1 * inch))
            details_elements.append(Paragraph(f"Descripción: {t.description}", styles['Normal']))
            details_elements.append(Spacer(1, 0.1 * inch))
            details_elements.append(Paragraph(f"Estado: {t.status}", styles['Normal']))
            details_elements.append(Paragraph(f"Prioridad: {t.priority}", styles['Normal']))
            details_elements.append(Paragraph(f"Creado por: {t.created_by.username}", styles['Normal']))
            details_elements.append(Paragraph(f"Asignado a: {t.assigned_to.username if t.assigned_to else 'N/A'}", styles['Normal']))
            details_elements.append(Paragraph(f"Fecha de Creación: {t.created_at.strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
            details_elements.append(Paragraph(f"Fecha de Cierre: {t.closed_at.strftime('%Y-%m-%d %H:%M') if t.closed_at else 'N/A'}", styles['Normal']))
            details_elements.append(Spacer(1, 0.2 * inch))
            details_elements.append(Paragraph("Evidencias:", styles['h3']))
            details_elements.append(Spacer(1, 0.1 * inch))

            for evidence in t.evidences.all():
                try:
                    # Construct absolute URL for the image
                    image_url = request.build_absolute_uri(evidence.file.url)
                    response_image = requests.get(image_url)
                    response_image.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

                    img_data = io.BytesIO(response_image.content)
                    
                    # Create ReportLab Image object
                    img = Image(img_data)
                    
                    # Scale image to fit within page width (e.g., 500 points wide)
                    # A4 width is 595 points, so 500 is a good fit with margins
                    img_width, img_height = img.drawWidth, img.drawHeight
                    aspect_ratio = img_height / img_width
                    
                    max_width = 500 # Max width for image in points
                    if img_width > max_width:
                        img.drawWidth = max_width
                        img.drawHeight = max_width * aspect_ratio
                    
                    details_elements.append(img)
                    details_elements.append(Spacer(1, 0.1 * inch))
                except requests.exceptions.RequestException as e:
                    details_elements.append(Paragraph(f"Error al cargar evidencia: {os.path.basename(evidence.file.name)} ({e})", styles['Error']))
                except Exception as e:
                    details_elements.append(Paragraph(f"Error al procesar evidencia: {os.path.basename(evidence.file.name)} ({e})", styles['Error']))
            details_elements.append(Spacer(1, 0.2 * inch))
    
    elements.extend(details_elements) # Add all detailed elements at the end

    doc.build(elements)
    return response


def computer_inventory_pdf_report(computers):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_inventario_computadoras.pdf"'

    doc = SimpleDocTemplate(response, pagesize=landscape(A4))
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("Reporte de Inventario de Computadoras", styles['Title']))
    elements.append(Spacer(1, 0.2 * inch))

    data = [
        ["Activo", "Marca", "Modelo", "Tipo", "Procesador", "RAM", "Almacenamiento", "SO", "Estado", "Asignado a", "Aula", "Sede"]
    ]

    for c in computers:
        assigned_to_name = f"{c.assigned_to_person.first_name} {c.assigned_to_person.last_name}" if c.assigned_to_person else "N/A"
        classroom_name = c.assigned_to_classroom.name if c.assigned_to_classroom else "N/A"
        site_name = c.site.name if c.site else "N/A"

        data.append([
            c.asset_tag,
            c.brand,
            c.model,
            c.get_equipment_type_display(),
            c.processor,
            c.ram,
            c.storage,
            c.operating_system,
            c.get_status_display(),
            assigned_to_name,
            classroom_name,
            site_name,
        ])

    table = Table(data)
    elements.append(table)

    doc.build(elements)
    return response
