import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BillDetailsStep from '../components/bill/BillDetailsStep.tsx';
import BillStepper from '../components/bill/BillStepper.tsx';
import type { ItemsMethod } from '../components/bill/ItemsMethodPicker.tsx';
import PersonForm from '../components/bill/PersonForm.tsx';
import PersonCard from '../components/bill/PersonCard.tsx';
import ProductCard from '../components/bill/ProductCard.tsx';
import ProductForm from '../components/bill/ProductForm.tsx';
import ReceiptScanButton from '../components/bill/ReceiptScanButton.tsx';
import { ShareButton } from '../components/bill/ShareButton.tsx';
import SplitPreview from '../components/bill/SplitPreview.tsx';
import { Button } from '../components/ui/Button.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { useBillDraft } from '../hooks/useBillDraft.ts';
import { useCreateBill } from '../hooks/useBills.ts';
import { useReceiptScan } from '../hooks/useReceiptScan.ts';
import { useToast } from '../hooks/useToast.ts';
import { buildSplitShareData } from '../utils/shareText.ts';
import {
    calculateBillSplit,
    capitalize,
    draftToCreateBillRequest,
    formatDayLabel,
    formatMoney,
    getBillPayer,
    todayISODate,
} from '../utils/utils.ts';
import { ChevronRightIcon } from '../components/ui/icons.tsx';

type Step = 'details' | 'items';

export default function NewBillPage() {
    const {
        draft,
        setTitle,
        setPlace,
        setDate,
        setPayerId,
        addPerson,
        removePerson,
        addProduct,
        addProducts,
        removeProduct,
        setProductParticipants,
        reset,
    } = useBillDraft();

    const { createBill, isCreating } = useCreateBill();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    // Passo 1 ("Detalhes") do design; o passo "items" concentra, por enquanto, o que o
    // design separa em Itens, Pessoas, Consumo e Resumo (passos 2 a 5, ainda não redesenhados).
    const [step, setStep] = useState<Step>('details');
    const [method, setMethod] = useState<ItemsMethod>(() =>
        draft.products.length > 0 ? 'manual' : 'scan'
    );
    const [today] = useState(todayISODate);
    const [showTitleError, setShowTitleError] = useState(false);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const scanInputRef = useRef<HTMLInputElement>(null);

    const { isScanning, scan } = useReceiptScan((scanned) => {
        if (scanned.length === 0) {
            toast.error('Não consegui identificar itens nessa nota. Tente outra foto.');
            return;
        }

        addProducts(
            scanned.map((item) => ({
                name: item.name,
                unitPrice: Number(item.unit_price),
                quantity: item.quantity,
            }))
        );

        toast.success(`${scanned.length} item(ns) lido(s) da nota. Confira e vincule quem consumiu.`);
        setStep('items');
    });

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const split = calculateBillSplit(draft);

    const userName = user?.name ?? user?.email ?? '';
    const date = draft.date || today;

    const canSave =
        draft.title.trim().length > 0 &&
        draft.products.length > 0 &&
        draft.persons.length > 0 &&
        split.success;

    function handleTitleChange(title: string) {
        setTitle(title);
        setShowTitleError(false);
    }

    function handleContinue() {
        if (draft.title.trim().length === 0) {
            setShowTitleError(true);
            titleInputRef.current?.focus();
            return;
        }

        if (method === 'scan') {
            scanInputRef.current?.click();
            return;
        }

        setStep('items');
    }

    function handleScanFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        event.target.value = '';

        if (file) {
            void scan(file);
        }
    }

    async function handleSave() {
        if (!canSave) {
            toast.error('Falta um título e vincular pelo menos uma pessoa a cada item');
            return;
        }

        try {
            const bill = await createBill(draftToCreateBillRequest(draft));

            reset();
            navigate(`/bills/${bill.id}`, { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível salvar a conta');
        }
    }

    if (step === 'details') {
        return (
            <div className="newbill">
                <nav className="newbill-crumbs" aria-label="Você está em">
                    <Link to="/">Contas</Link>
                    <ChevronRightIcon size={14} strokeWidth={2.6} />
                    <strong>Nova conta</strong>
                </nav>

                <h1 className="newbill-title">Nova conta</h1>

                <BillStepper current={1} />

                <input
                    ref={scanInputRef}
                    type="file"
                    accept="image/*"
                    className="visually-hidden"
                    onChange={handleScanFile}
                    aria-hidden="true"
                    tabIndex={-1}
                />

                <BillDetailsStep
                    draft={draft}
                    date={date}
                    userName={userName}
                    method={method}
                    isBusy={isScanning}
                    titleError={
                        showTitleError && draft.title.trim().length === 0
                            ? 'Dê um nome para a conta'
                            : undefined
                    }
                    titleInputRef={titleInputRef}
                    onTitleChange={handleTitleChange}
                    onPlaceChange={setPlace}
                    onDateChange={setDate}
                    onPayerChange={setPayerId}
                    onMethodChange={setMethod}
                    onCancel={() => navigate('/')}
                    onContinue={handleContinue}
                />
            </div>
        );
    }

    const payer = getBillPayer(draft, userName);
    const summary = [draft.place.trim(), capitalize(formatDayLabel(date)), `Pagou: ${payer.name}`]
        .filter(Boolean)
        .join(' · ');

    return (
        <div className="page has-save-bar">
            <div className="page-header">
                <div>
                    <h1>Nova conta</h1>
                    <p className="page-subtitle">
                        Escaneie a nota ou cadastre na mão, junte a galera e defina quem ficou com o quê.
                    </p>
                </div>

                <div className="page-header-actions hide-on-mobile">
                    <Button variant="ghost" onClick={reset} disabled={isCreating}>
                        Limpar
                    </Button>

                    <Button size="lg" onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>

            <section className="panel bill-summary">
                <div className="bill-summary-info">
                    <strong>{draft.title.trim()}</strong>
                    <span>{summary}</span>
                </div>

                <Button variant="outline" size="sm" onClick={() => setStep('details')}>
                    Editar detalhes
                </Button>
            </section>

            <section className="panel">
                <div className="panel-header-row">
                    <div className="panel-title">
                        <span className="step-badge">1</span>
                        <span>Itens da conta</span>
                    </div>

                    <ReceiptScanButton onConfirm={addProducts} />
                </div>

                <ProductForm onAddProduct={addProduct} />

                <div className="card-list">
                    {draft.products.length === 0 && (
                        <p className="panel-empty">
                            Nenhum item ainda. Fotografe a nota ou adicione um item acima.
                        </p>
                    )}

                    {draft.products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            persons={draft.persons}
                            relations={draft.relations}
                            isAddingPeople={selectedProductId === product.id}
                            onToggleAddPeople={(productId) =>
                                setSelectedProductId((current) =>
                                    current === productId ? null : productId
                                )
                            }
                            onCloseAddPeople={() => setSelectedProductId(null)}
                            onConfirmParticipants={setProductParticipants}
                            onRemove={removeProduct}
                        />
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="panel-title">
                    <span className="step-badge">2</span>
                    <span>Quem estava junto</span>
                </div>

                <PersonForm onAddPerson={addPerson} />

                <div className="card-list">
                    {draft.persons.length === 0 && (
                        <p className="panel-empty">Ninguém cadastrado ainda.</p>
                    )}

                    {draft.persons.map((person) => (
                        <PersonCard
                            key={person.id}
                            person={person}
                            products={draft.products}
                            relations={draft.relations}
                            onRemove={removePerson}
                        />
                    ))}
                </div>
            </section>

            {draft.products.length > 0 && (
                <section className="panel">
                    <div className="panel-header-row">
                        <div className="panel-title">
                            <span className="step-badge">3</span>
                            <span>Prévia da divisão</span>
                        </div>

                        {split.success && (
                            <ShareButton
                                data={buildSplitShareData(draft.title, split)}
                                variant="ghost"
                                size="sm"
                            />
                        )}
                    </div>

                    <SplitPreview result={split} />
                </section>
            )}

            <div className="save-bar">
                <div className="save-bar-info">
                    <span>Total</span>
                    <strong>R$ {split.success ? formatMoney(split.totalBill) : '0,00'}</strong>
                </div>

                <div className="save-bar-actions">
                    <Button variant="ghost" onClick={reset} disabled={isCreating} size="sm">
                        Limpar
                    </Button>

                    <Button onClick={handleSave} loading={isCreating} disabled={!canSave}>
                        Salvar conta
                    </Button>
                </div>
            </div>
        </div>
    );
}
