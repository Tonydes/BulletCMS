import { Component, signal, computed, effect, inject, DestroyRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BcmsDatepickerComponent } from 'src/app/shared/ui-components';
import { AuthorDto, TagDto, FeatureDto, PageDto } from 'src/app/core/models';
import { EditPageService } from 'src/app/core/services';

// EditorJS Imports
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Alert from 'editorjs-alert';
import NestedList from '@editorjs/nested-list';
import Table from '@editorjs/table';
import Raw from '@editorjs/raw';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import Undo from 'editorjs-undo';
import DragDrop from 'editorjs-drag-drop';
import Underline from '@editorjs/underline';
import Checklist from '@editorjs/checklist';

// PrimeNG Imports
import { FluidModule } from 'primeng/fluid';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitchChangeEvent, ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';

const config = {
  shortcuts: {
    undo: 'CMD+Z',
    redo: 'CMD+SHIFT+Z'
  }
};

@Component({
  selector: 'bcms-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FluidModule,
    ToolbarModule,
    TabsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DividerModule,
    CardModule,
    FileUploadModule,
    ToggleSwitchModule,
    TextareaModule,
    BcmsDatepickerComponent,
    ToggleButtonModule
  ],
  providers: [EditPageService, MessageService]
})
export class EditPageComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  // Editor instance
  private editor!: EditorJS;

  loading = true;

  uploadedFiles: any[] = [];

  // Signals
  pageMode = signal<'create' | 'edit'>('create');
  saving = signal(false);
  publishing = signal(false);
  showFilterSelector = signal(false);

  // Data signals
  authors = signal<AuthorDto[]>([]);
  tags = signal<TagDto[]>([]);
  availableFeatures = signal<FeatureDto[]>([]);

  // Computed values
  pageUrl = computed(() => {
    const slug = this.pageForm.get('slug')?.value;
    return slug ? `/pages/${slug}` : '';
  });

  filterOptions = [
    { label: 'Select list', value: 0 },
    { label: 'Blog list', value: 1 },
    { label: 'By Category', value: 2 },
    { label: 'By Author', value: 3 },
    { label: 'By Tag', value: 4 }
  ];

  parentOptions = [
    { label: 'Select parent', value: 0 },
    { label: 'Ciccio', value: 1 },
    { label: 'Pasticcio', value: 2 }
  ];

  headerOptions = [
    { label: 'Select header', value: 0 },
    { label: 'Header 1', value: 1 },
    { label: 'Header 2', value: 2 }
  ];

  maxFileSize = 2 * 1024 * 1024; // 2MB

  // Form group

  pageForm!: FormGroup;

  constructor(private messageService: MessageService) {
    this.initializeForm();
    this.setupFormEffects();
    this.loadInitialData();
  }

  private initializeForm() {
    this.pageForm = this.fb.group({
      title: ['', Validators.required],
      featuredImage: [''],
      content: [''],
      author: [''],
      publishDate: [new Date()],
      isPublished: [false],
      tags: [[]],
      parent: [0],
      header: [0],
      articleFilter: [0],
      filterValue: [''],
      components: [[]],

      // --- Campi SEO e URL ---
      slug: [''], // Già presente
      metaTitle: [''], // Già presente (corrisponde a Titolo SEO)
      metaDescription: [''], // Già presente
      focusKeyphrase: [''], // NUOVO: Parola chiave principale (per analisi)
      canonicalUrl: [''], // RINOMINATO da 'canonical' per coerenza con HTML (o mantieni 'canonical' se preferisci)
      metaRobotsIndex: ['index'], // NUOVO: Valori possibili: 'index', 'noindex'
      metaRobotsFollow: ['follow'], // NUOVO: Valori possibili: 'follow', 'nofollow'

      // --- Open Graph (Social Sharing) ---
      ogTitle: [''], // NUOVO: Titolo per Facebook, LinkedIn, etc.
      ogDescription: [''], // NUOVO: Descrizione per Facebook, LinkedIn, etc.
      ogImageUrl: [''], // RINOMINATO da 'ogImage' per coerenza (o mantieni 'ogImage')

      excludeFromSitemap: [false]
    });
  }

  private setupFormEffects() {
    // Auto-generate slug from title
    this.pageForm
      .get('title')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((title) => {
        if (title) {
          const slug = this.generateSlug(title);
          this.pageForm.patchValue({ slug }, { emitEvent: false });
        } else {
          this.pageForm.patchValue({ slug: '' }, { emitEvent: false });
        }
      });

    // Handle article filter changes
    this.pageForm
      .get('articleFilter')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filter) => {
        this.showFilterSelector.set(filter.value && filter.value !== 1);
        this.pageForm.patchValue({ filterValue: filter?.value });
      });

    // Setup effect for form changes
    effect(() => {
      if (this.pageForm.dirty) {
        this.autoSaveDraft();
      }
    });
  }

  private loadInitialData() {
    // Mock data - replace with actual API calls
    this.authors.set([
      { id: '1', name: 'John', surname: 'Doe' },
      { id: '2', name: 'Jane', surname: 'Smith' }
    ]);

    this.tags.set([
      { id: '1', name: 'Technology' },
      { id: '2', name: 'Business' }
    ]);

    this.availableFeatures.set([
      { id: '1', name: 'Contact Form', type: 0 },
      { id: '2', name: 'Newsletter', type: 1 }
    ]);
    this.loading = false;
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  private initializeEditor() {
    const editor = new EditorJS({
      holder: 'editorjs',
      placeholder: 'Write content here',
      tools: {
        alignmentTuneTool: {
          class: AlignmentTuneTool
        },
        paragraph: {
          inlineToolbar: true
        },
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: 'Header'
          },
          shortcut: 'CMD+SHIFT+H',
          tunes: ['alignmentTuneTool']
        },
        list: {
          class: NestedList,
          inlineToolbar: true,
          config: {
            placeholder: 'List'
          },
          shortcut: 'CMD+SHIFT+L',
          tunes: ['alignmentTuneTool']
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'api/upload/image'
            }
          }
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          tunes: ['alignmentTuneTool']
        },
        code: {
          class: CodeTool,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+C'
        },
        delimiter: Delimiter,
        inlineCode: InlineCode,
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              soundcloud: true,
              twitter: true
            }
          },
          shortcut: 'CMD+SHIFT+E',
          tunes: ['alignmentTuneTool']
        },
        table: {
          class: Table,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+T',
          tunes: ['alignmentTuneTool']
        },
        quote: Quote,
        alert: {
          class: Alert,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+A',
          config: {
            alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
            defaultType: 'primary',
            messagePlaceholder: 'Enter something'
          }
        },
        raw: Raw,
        underline: Underline
      },
      data: this.pageForm.get('content')?.value || { blocks: [] },
      onReady: () => {
        new Undo({ editor, config });
        new DragDrop(editor);
      },
      onChange: async () => {
        this.handleChange();
      }
    });
    this.editor = editor;
  }

  handleChange() {
    this.editor.save().then((content) => {
      console.log(JSON.stringify(content, null, 2));
      this.pageForm.patchValue({ content });
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async savePage() {
    if (this.pageForm.invalid) {
      this.markFormsTouched();
      return;
    }

    try {
      this.saving.set(true);
      const editorContent = await this.editor.save();

      const pageData: PageDto = {
        ...this.pageForm.value,
        content: editorContent
      };

      // Call your API service here
      console.log('Saving page:', pageData);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      this.saving.set(false);
    }
  }

  async publishPage() {
    try {
      this.publishing.set(true);
      await this.savePage();
      this.pageForm.patchValue({ isPublished: true });

      // Call your API service here
      console.log('Publishing page');

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error publishing page:', error);
    } finally {
      this.publishing.set(false);
    }
  }

  previewPage() {
    // Implement preview logic (e.g., open in new tab)
    const previewUrl = `/preview${this.pageUrl()}`;
    window.open(previewUrl, '_blank');
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    this.pageForm.patchValue({ featuredImage: file.name });
  }

  getFilterValues() {
    const filterType = this.pageForm.get('articleFilter')?.value;
    switch (filterType) {
      case 2:
        return [{ label: 'Technology', value: 'tech' }];
      case 3:
        return this.authors().map((author) => ({
          label: author.name,
          value: author.id
        }));
      case 4:
        return this.tags().map((tag) => ({
          label: tag.name,
          value: tag.id
        }));
      default:
        return [];
    }
  }

  onFilterChange(event: SelectChangeEvent) {
    switch (event.value) {
      case 0:
        return this.showFilterSelector.update(() => false);
      case 1:
        return this.showFilterSelector.update(() => false);
      default:
        return this.showFilterSelector.update(() => true);
    }
  }

  togglePublish(event: ToggleSwitchChangeEvent) {
    console.log(event);
  }

  private markFormsTouched() {
    Object.keys(this.pageForm.controls).forEach((key) => {
      const control = this.pageForm.get(key);
      control?.markAsTouched();
    });
  }

  private autoSaveDraft() {
    // Implement auto-save logic
    console.log('Auto-saving draft...');
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}
